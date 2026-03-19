package spotvault.controller.interfaces;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import spotvault.dto.ShareSpotDTO;
import spotvault.dto.SpotDTO;

public interface ISpotController {
    ResponseEntity<SpotDTO> getSpotById(@PathVariable String spotId);
    ResponseEntity<SpotDTO> createSpot(@RequestBody ShareSpotDTO shareSpotDTO);
}
