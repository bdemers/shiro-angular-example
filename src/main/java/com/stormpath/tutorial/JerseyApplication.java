package com.stormpath.tutorial;


import org.glassfish.jersey.server.ResourceConfig;

/**
 * Simple jersey application.
 */
public class JerseyApplication extends ResourceConfig {

    public JerseyApplication() {
        // Add a package used to scan for components.
        packages(this.getClass().getPackage().getName());
    }
}
