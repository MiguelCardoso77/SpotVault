package spotvault.utils;

import java.time.LocalDateTime;
import org.locationtech.jts.geom.Point;

public class Guards {

    public static void guardAgainstNull(String var, String varName) {
        if (var == null || var.isEmpty()) {
            System.out.println(varName + " Failed Guard Against Null.");
            throw new IllegalArgumentException();
        }
    }

    public static void guardAgainstValidLocalDateTime(LocalDateTime var, String varName) {
        if (var == null || var.isAfter(LocalDateTime.now())) {
            System.out.println(varName + " Failed Guard Against ValidLocalDateTime.");
            throw new IllegalArgumentException();
        }
    }

    public static void guardAgainstValidLocation(Point location, String varName) {
        if (location == null || location.getCoordinate() == null) {
            System.out.println(varName + " Failed Guard Against ValidLocation.");
            throw new IllegalArgumentException();
        }

        double lat = location.getY();
        double lng = location.getX();

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            System.out.println(varName + " Failed Guard Against ValidLocation.");
            throw new IllegalArgumentException();
        }
    }
}