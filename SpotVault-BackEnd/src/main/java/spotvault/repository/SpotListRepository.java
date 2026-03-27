package spotvault.repository;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import spotvault.domain.Account;
import spotvault.domain.SpotList;
import spotvault.domain.VisibilityStatus;
import spotvault.repository.interfaces.ISpotListRepository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public class SpotListRepository implements ISpotListRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public SpotListRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public SpotList getListById(String listId) {
        String sql = """
                SELECT sl."listId", sl."name", sl."description", sl."icon", sl."color", sl."visibilityStatus", sl."createdAt", sl."updatedAt",
                       a."accountId", a."email", a."username", a."tier", a."status", a."createdAt" AS "accountCreatedAt", a."updatedAt" AS "accountUpdatedAt"
                FROM "SpotLists" sl
                JOIN "Accounts" a ON sl."ownerId" = a."accountId"
                WHERE sl."listId" = :listId
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("listId", UUID.fromString(listId));

        return jdbc.queryForObject(sql, params, (rs, rowNum) -> {
            LocalDateTime accountCreatedAt = rs.getTimestamp("accountCreatedAt").toLocalDateTime();
            LocalDateTime accountUpdatedAt = rs.getTimestamp("accountUpdatedAt").toLocalDateTime();
            Account owner = new Account(
                    UUID.fromString(rs.getString("accountId")),
                    rs.getString("email"),
                    rs.getString("username"),
                    rs.getString("tier"),
                    rs.getString("status"),
                    accountCreatedAt,
                    accountUpdatedAt
            );
            return new SpotList(
                    owner,
                    rs.getString("name"),
                    rs.getString("description"),
                    rs.getString("icon"),
                    rs.getString("color"),
                    VisibilityStatus.values()[rs.getInt("visibilityStatus")],
                    rs.getTimestamp("createdAt").toLocalDateTime(),
                    rs.getTimestamp("updatedAt").toLocalDateTime()
            );
        });
    }

    @Override
    public SpotList createList(SpotList spotList) {
        String sql = """
                INSERT INTO "SpotLists"
                    ("listId", "ownerId", "name", "description", "icon", "color", "visibilityStatus", "createdAt", "updatedAt")
                VALUES
                    (:listId, :ownerId, :name, :description, :icon, :color, CAST(:visibilityStatus AS smallint), :createdAt, :updatedAt)
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("listId",           spotList.getListId())
                .addValue("ownerId",          spotList.getOwner().getAccountId())
                .addValue("name",             spotList.getName())
                .addValue("description",      spotList.getDescription())
                .addValue("icon",             spotList.getIcon())
                .addValue("color",            spotList.getColor())
                .addValue("visibilityStatus", spotList.getVisibilityStatus().ordinal())
                .addValue("createdAt",        Timestamp.valueOf(spotList.getCreatedAt()))
                .addValue("updatedAt",        Timestamp.valueOf(spotList.getUpdatedAt()));

        jdbc.update(sql, params);
        return spotList;
    }
}
