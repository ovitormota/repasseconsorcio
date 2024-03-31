package br.com.repasseconsorcio.service.util;

import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.security.SecurityUtils;
import br.com.repasseconsorcio.service.UserService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserCustomUtility {

    private static UserService userService;

    @Autowired
    private UserCustomUtility(UserService userService) {
        UserCustomUtility.userService = userService;
    }

    public static User getUserCustom() {
        Optional<String> login = SecurityUtils.getCurrentUserLogin();

        if (login.isPresent()) {
            return userService.getUserWithAuthoritiesByUserAndLogin(login.get()).get();
        }

        return null;
    }
}
