package spotvault.domain;

import jakarta.persistence.*;
import spotvault.utils.Guards;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "SpotLists")
public class SpotList {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID listId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerId", referencedColumnName = "accountId", nullable = false)
    private Account owner;

    @Column(nullable = false)
    private String name;

    @Column()
    private String description;

    @Column()
    private String icon;

    @Column()
    private String color;

    @OneToMany
    @JoinTable(name = "ListSpots", joinColumns = @JoinColumn(name = "listId"), inverseJoinColumns = @JoinColumn(name = "spotId"))
    private List<Spot> spots;

    @Column(nullable = false)
    private VisibilityStatus visibilityStatus;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public SpotList(Account owner, String name, String description, String icon, String color, VisibilityStatus visibilityStatus, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.listId = UUID.randomUUID();
        this.owner = owner;

        Guards.guardAgainstNull(name, "Name");
        this.name = name;

        this.description = description;
        this.icon = icon;
        this.color = color;
        this.spots = new ArrayList<>();
        this.visibilityStatus = visibilityStatus;

        Guards.guardAgainstValidLocalDateTime(createdAt, "CreatedAt");
        this.createdAt = createdAt;

        Guards.guardAgainstValidLocalDateTime(updatedAt, "UpdatedAt");
        this.updatedAt = updatedAt;
    }

    protected SpotList() { }

    public List<Spot> addSpot(Spot spot) {
        this.spots.add(spot);
        return spots;
    }

    public List<Spot> removeSpot(Spot spot) {
        this.spots.remove(spot);
        return spots;
    }

    public UUID getListId() { return listId; }
    public Account getOwner() { return owner; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getIcon() { return icon; }
    public String getColor() { return color; }
    public List<Spot> getSpots() { return spots; }
    public VisibilityStatus getVisibilityStatus() { return visibilityStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}