package spotvault.utils;

import java.time.LocalDateTime;

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
}