package spotvault.mapper;

import spotvault.domain.Spot;
import spotvault.domain.SpotList;
import spotvault.dto.SpotListDTO;

import java.util.List;
import java.util.UUID;

public class SpotListMapper implements Mapper<SpotList, SpotListDTO> {

    @Override
    public SpotListDTO toDTO(SpotList spotList) {
        List<UUID> spotIds = spotList.getSpots().stream().map(Spot::getSpotId).toList();

        return new SpotListDTO(
            spotList.getListId(),
            spotList.getOwner().getAccountId(),
            spotList.getName(),
            spotList.getDescription(),
            spotList.getIcon(),
            spotList.getColor(),
            spotList.getVisibilityStatus(),
            spotIds,
            spotList.getCreatedAt(),
            spotList.getUpdatedAt()
        );
    }

    @Override
    public SpotList toDomain(SpotListDTO spotListDTO) {
        throw new UnsupportedOperationException("Cannot map SpotListDTO to SpotList without resolving Account from ownerId. Use the service layer.");
    }
}