package spotvault.service;

import org.springframework.stereotype.Service;
import spotvault.dto.AccountDTO;
import spotvault.service.interfaces.IAccountService;

@Service
public class AccountService implements IAccountService {

    @Override
    public AccountDTO getAccountById(String accountId) {
        return null;
    }

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO) {
        return null;
    }

    @Override
    public AccountDTO deleteAccount(String accountId) {
        return null;
    }
}
