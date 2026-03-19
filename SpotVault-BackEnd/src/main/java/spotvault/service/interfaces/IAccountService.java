package spotvault.service.interfaces;

import spotvault.dto.AccountDTO;

public interface IAccountService {
    AccountDTO getAccountById(String accountId);
    AccountDTO createAccount(AccountDTO accountDTO);
    AccountDTO deleteAccount(String accountId);
}
