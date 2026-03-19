package spotvault.controller.interfaces;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spotvault.dto.AccountDTO;

public interface IAccountController {

    ResponseEntity<AccountDTO> getAccountById(@PathVariable String accountId);
    ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO);
    ResponseEntity<AccountDTO> deleteAccount(@PathVariable String accountId);
}