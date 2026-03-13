package spotvault.domain;

import jakarta.persistence.*;
import spotvault.utils.Guards;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID accountId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String tier;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Account(String email, String username, String tier, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.accountId = UUID.randomUUID();

        this.email = email;
        Guards.guardAgainstNull(email, "Email");

        this.username = username;
        Guards.guardAgainstNull(username, "Username");

        this.tier = tier;
        Guards.guardAgainstNull(tier, "Tier");

        this.status = status;
        Guards.guardAgainstNull(status, "Status");

        this.createdAt = createdAt;
        Guards.guardAgainstValidLocalDateTime(createdAt, "CreatedAt");

        this.updatedAt = updatedAt;
        Guards.guardAgainstValidLocalDateTime(updatedAt, "UpdatedAt");
    }

    protected Account() { }
}