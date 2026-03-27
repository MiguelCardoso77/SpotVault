package spotvault.service.interfaces;

import spotvault.dto.SpotListDTO;

public interface ISpotListService {
    SpotListDTO getListById(String listId);
    SpotListDTO createList(SpotListDTO spotListDTO);
}
