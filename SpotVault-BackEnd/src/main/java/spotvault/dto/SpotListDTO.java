package spotvault.dto;

import spotvault.domain.VisibilityStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SpotListDTO(
        UUID listId,
        UUID ownerId,
        String name,
        String description,
        String icon,
        String color,
        VisibilityStatus visibilityStatus,
        List<UUID> spotIds,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
