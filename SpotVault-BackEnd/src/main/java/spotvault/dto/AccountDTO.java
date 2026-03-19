package spotvault.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class AccountDTO {

    private final UUID accountId;
    private final String email;
    private final String username;
    private final String tier;
    private final String status;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public AccountDTO(UUID accountId, String email, String username, String tier, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.accountId = accountId;
        this.email = email;
        this.username = username;
        this.tier = tier;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getAccountId() { return accountId; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getTier() { return tier; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}