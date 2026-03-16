package spotvault.service.interfaces;

import spotvault.dto.ShareSpotDTO;
import spotvault.dto.SpotDTO;

public interface ISpotService {
    SpotDTO getSpotById(String spotId);
    SpotDTO createGoogleMapsSpot(ShareSpotDTO shareSpotDTO);
    SpotDTO createInstagramSpot(ShareSpotDTO shareSpotDTO);
}
