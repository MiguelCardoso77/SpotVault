package spotvault.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import spotvault.controller.interfaces.ISpotController;
import spotvault.dto.ShareSpotDTO;
import spotvault.dto.SpotDTO;
import spotvault.service.interfaces.ISpotService;

@RestController
@RequestMapping("/api/v1/spots")
public class SpotController implements ISpotController {

    private final ISpotService spotService;

    public SpotController(ISpotService spotService) {
        this.spotService = spotService;
    }

    @Override
    @GetMapping("/{spotId}")
    public ResponseEntity<SpotDTO> getSpotById(@PathVariable String spotId) {
        return ResponseEntity.ok(spotService.getSpotById(spotId));
    }

    @Override
    @PostMapping
    public ResponseEntity<SpotDTO> createSpot(@RequestBody ShareSpotDTO shareSpotDTO) {
        return switch (shareSpotDTO.application()) {
            case "GOOGLE_MAPS" -> ResponseEntity.ok(spotService.createGoogleMapsSpot(shareSpotDTO));
            case "INSTAGRAM" -> ResponseEntity.ok(spotService.createInstagramSpot(shareSpotDTO));
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Application");
        };
    }
}
