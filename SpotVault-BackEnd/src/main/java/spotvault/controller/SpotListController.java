package spotvault.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spotvault.controller.interfaces.ISpotListController;
import spotvault.dto.SpotListDTO;
import spotvault.service.interfaces.ISpotListService;

@RestController
@RequestMapping("/api/v1/lists")
public class SpotListController implements ISpotListController {

    private final ISpotListService spotListService;

    public SpotListController(ISpotListService spotListService) {
        this.spotListService = spotListService;
    }

    @Override
    @GetMapping("/{listId}")
    public ResponseEntity<SpotListDTO> getListById(@PathVariable String listId) {
        return ResponseEntity.ok(spotListService.getListById(listId));
    }

    @Override
    @PostMapping
    public ResponseEntity<SpotListDTO> createList(@RequestBody SpotListDTO spotListDTO) {
        return ResponseEntity.ok(spotListService.createList(spotListDTO));
    }
}
