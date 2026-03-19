package spotvault.service;

import org.springframework.stereotype.Service;
import spotvault.dto.ShareSpotDTO;
import spotvault.dto.SpotDTO;
import spotvault.service.interfaces.ISpotService;

@Service
public class SpotService implements ISpotService {

    public SpotDTO getSpotById(String spotId) { return null; }
    public SpotDTO createGoogleMapsSpot(ShareSpotDTO shareSpotDTO) { return null; }
    public SpotDTO createInstagramSpot(ShareSpotDTO shareSpotDTO){ return null; }
}
