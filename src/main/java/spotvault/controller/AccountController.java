package spotvault.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spotvault.controller.interfaces.IAccountController;
import spotvault.dto.AccountDTO;
import spotvault.service.interfaces.IAccountService;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController implements IAccountController {

    private final IAccountService accountService;

    public AccountController(IAccountService accountService) {
        this.accountService = accountService;
    }

    @Override
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable String accountId) {
        return ResponseEntity.ok(accountService.getAccountById(accountId));
    }

    @Override
    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO accountDTO) {
        return ResponseEntity.ok(accountService.createAccount(accountDTO));
    }

    @Override
    @DeleteMapping("/{accountId}")
    public ResponseEntity<AccountDTO> deleteAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(accountService.deleteAccount(accountId));
    }
}