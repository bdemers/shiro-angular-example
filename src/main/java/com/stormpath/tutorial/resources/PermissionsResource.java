package com.stormpath.tutorial.resources;

import com.stormpath.sdk.account.Account;
import com.stormpath.sdk.group.Group;
import com.stormpath.sdk.servlet.account.AccountResolver;
import com.stormpath.shiro.realm.AccountCustomDataPermissionResolver;
import com.stormpath.shiro.realm.GroupCustomDataPermissionResolver;
import org.apache.shiro.authz.Permission;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.util.HashSet;
import java.util.Set;

@Path("/permissions")
public class PermissionsResource {


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String[] getPermissions(@Context HttpServletRequest request) {

        Set<String> permissions = new HashSet<>();

        GroupCustomDataPermissionResolver groupPermissionResolver = new GroupCustomDataPermissionResolver();
        AccountCustomDataPermissionResolver accountPermissionResolver = new AccountCustomDataPermissionResolver();

        Account account = AccountResolver.INSTANCE.getAccount(request);
        if(account != null) {

            account.getGroups().forEach(group ->
                    groupPermissionResolver.resolvePermissions(group).forEach(perm ->
                            permissions.add(perm.toString())));

            accountPermissionResolver.resolvePermissions(account).forEach(perm -> permissions.add(perm.toString()));
        }

        return permissions.stream().toArray(String[]::new);
    }

}
