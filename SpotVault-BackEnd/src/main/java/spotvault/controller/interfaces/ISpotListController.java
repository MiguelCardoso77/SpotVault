package spotvault.controller.interfaces;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import spotvault.dto.SpotListDTO;

public interface ISpotListController {
    ResponseEntity<SpotListDTO> getListById(@PathVariable String listId);
    ResponseEntity<SpotListDTO> createList(@RequestBody SpotListDTO spotListDTO);
}
