package spotvault.service;

import org.springframework.stereotype.Service;
import spotvault.dto.SpotListDTO;
import spotvault.service.interfaces.ISpotListService;

@Service
public class SpotListService implements ISpotListService {
    @Override
    public SpotListDTO getListById(String listId) {
        return null;
    }

    @Override
    public SpotListDTO createList(SpotListDTO spotListDTO) {
        return null;
    }
}
