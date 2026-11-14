from dataclasses import dataclass


LOW_BATTERY_THRESHOLD = 20
BATTERY_COST_PER_WAYPOINT = 10


@dataclass
class Drone:
    name: str
    battery: int

    def can_visit_waypoint(self) -> bool:
        return self.battery >= max(
            LOW_BATTERY_THRESHOLD, BATTERY_COST_PER_WAYPOINT
        )

    def visit_waypoint(self, waypoint: str) -> None:
        self.battery -= BATTERY_COST_PER_WAYPOINT
        print(f"{self.name}, {waypoint} noktasını tamamladı (batarya %{self.battery}).")


def run_mission(waypoints: list[str], primary: Drone, backup: Drone) -> bool:
    active_drone = primary
    print(f"Görev {primary.name} ile başladı. Rota: {', '.join(waypoints)}.")

    for index, waypoint in enumerate(waypoints):
        if not active_drone.can_visit_waypoint():
            remaining = len(waypoints) - index
            if active_drone is backup or not backup.can_visit_waypoint():
                print(f"Görev durdu. {remaining} rota noktası tamamlanamadı.")
                return False

            print(
                f"{primary.name} bataryası %{primary.battery}. "
                f"{backup.name} kalan {remaining} noktayı devraldı."
            )
            active_drone = backup

        active_drone.visit_waypoint(waypoint)

    print(f"Görev tamamlandı. {len(waypoints)} rota noktası ziyaret edildi.")
    return True


if __name__ == "__main__":
    run_mission(
        ["A", "B", "C", "D", "E"],
        primary=Drone("İHA 1", battery=35),
        backup=Drone("İHA 2", battery=80),
    )
