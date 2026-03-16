package spotvault.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SpotDTO(
    UUID spotId,
    String name,
    String description,
    double latitude,
    double longitude,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) { }