package spotvault.domain;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;
import spotvault.utils.Guards;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Spots")
public class Spot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID spotId;

    @Column(nullable = false)
    private String name;

    @Column()
    private String description;

    @Column(columnDefinition = "geography(Point, 4326)", nullable = false)
    private Point location;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Spot(String name, String description, Point location, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.spotId = UUID.randomUUID();

        Guards.guardAgainstNull(name, "Name");
        this.name = name;

        this.description = description;

        Guards.guardAgainstValidLocation(location, "Location");
        this.location = location;

        Guards.guardAgainstValidLocalDateTime(createdAt, "CreatedAt");
        this.createdAt = createdAt;

        Guards.guardAgainstValidLocalDateTime(updatedAt, "UpdatedAt");
        this.updatedAt = updatedAt;
    }

    protected Spot() { }
}