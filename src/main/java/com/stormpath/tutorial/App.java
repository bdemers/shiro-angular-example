package com.stormpath.tutorial;

import com.stormpath.tutorial.resources.PermissionsResource;
import com.stormpath.tutorial.resources.TrooperResource;
import com.stormpath.tutorial.resources.WelcomeResource;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class App extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(PermissionsResource.class);
        classes.add(WelcomeResource.class);
        classes.add(PermissionsResource.class);
        classes.add(TrooperResource.class);
        return classes;
    }
}
