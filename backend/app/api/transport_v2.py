"""Transport v2 API with GPS simulation"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, Bus, BusRoute, User
import random, math
from datetime import datetime

router = APIRouter(prefix="/api/transport", tags=["transport"])

MOCK_BUSES = [
    {"id":"bus-1","number":"TN-SRM-01","route":"R01","route_name":"Tambaram Express","driver":"Kumar R.",
     "capacity":52,"occupied":41,"speed":48,"location":"Vandalur Junction","eta":12,"status":"on_time",
     "lat":12.9249,"lng":80.1000,"stops":["SRM Gate","Potheri","Vandalur","Tambaram","Pallavaram"],"delay":0},
    {"id":"bus-2","number":"TN-SRM-04","route":"R02","route_name":"Velachery Shuttle","driver":"Suresh P.",
     "capacity":52,"occupied":38,"speed":0,"location":"Perungudi Signal","eta":23,"status":"delayed",
     "lat":12.9516,"lng":80.2209,"stops":["SRM Gate","Medavakkam","Perungudi","Velachery","OMR"],"delay":8},
    {"id":"bus-3","number":"TN-SRM-07","route":"R03","route_name":"Chrompet Link","driver":"Rajan M.",
     "capacity":52,"occupied":29,"speed":55,"location":"Urapakkam","eta":7,"status":"on_time",
     "lat":12.9050,"lng":80.0720,"stops":["SRM Gate","Guduvanchery","Urapakkam","Chrompet"],"delay":0},
    {"id":"bus-4","number":"TN-SRM-11","route":"R04","route_name":"Porur Connect","driver":"Prakash V.",
     "capacity":52,"occupied":47,"speed":42,"location":"Porur Flyover","eta":14,"status":"on_time",
     "lat":13.0350,"lng":80.1560,"stops":["SRM Gate","Potheri","Vandalur","Porur","Koyambedu"],"delay":0},
    {"id":"bus-5","number":"TN-SRM-15","route":"R05","route_name":"Saidapet Fast","driver":"Mani K.",
     "capacity":52,"occupied":22,"speed":36,"location":"Kotturpuram","eta":19,"status":"on_time",
     "lat":13.0100,"lng":80.2350,"stops":["SRM Gate","Perungudi","Kotturpuram","Saidapet"],"delay":5},
]

@router.get("/buses/live")
def get_live_buses():
    buses = []
    for b in MOCK_BUSES:
        bus = dict(b)
        if bus["speed"] > 0:
            bus["lat"] = round(b["lat"] + random.uniform(-0.002, 0.002), 7)
            bus["lng"] = round(b["lng"] + random.uniform(-0.002, 0.002), 7)
            bus["eta"] = max(1, b["eta"] + random.randint(-2, 2))
        bus["occupancy_pct"] = round(bus["occupied"] / bus["capacity"] * 100, 1)
        buses.append(bus)
    return buses

@router.get("/buses/{bus_id}/track")
def track_bus(bus_id: str):
    bus = next((b for b in MOCK_BUSES if b["id"] == bus_id), None)
    if not bus: return {"error": "Not found"}
    return {**bus, "last_updated": datetime.utcnow().isoformat(),
            "occupancy_pct": round(bus["occupied"]/bus["capacity"]*100,1)}

@router.get("/routes")
def get_routes():
    routes = []
    for b in MOCK_BUSES:
        routes.append({"route_number": b["route"], "route_name": b["route_name"],
                       "stops": b["stops"], "buses": 1, "delay": b["delay"],
                       "next_arrival": b["eta"]})
    return routes

@router.get("/stats")
def get_stats():
    delayed = sum(1 for b in MOCK_BUSES if b["status"] == "delayed")
    total_pax = sum(b["occupied"] for b in MOCK_BUSES)
    return {"total_buses": len(MOCK_BUSES), "buses_running": len(MOCK_BUSES),
            "delayed": delayed, "on_time": len(MOCK_BUSES) - delayed,
            "total_passengers": total_pax, "routes_active": 5}
