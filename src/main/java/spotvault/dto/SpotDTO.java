package spotvault.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class SpotDTO {

    private final UUID spotId;
    private final String name;
    private final String description;
    private final double latitude;
    private final double longitude;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public SpotDTO(UUID spotId, String name, String description, double latitude, double longitude, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.spotId = spotId;
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}