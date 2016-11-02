package com.stormpath.tutorial.rewrite;

import com.stormpath.sdk.lang.Collections;
import org.ocpsoft.logging.Logger;
import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.And;
import org.ocpsoft.rewrite.config.Condition;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.config.Direction;
import org.ocpsoft.rewrite.config.Log;
import org.ocpsoft.rewrite.config.Or;
import org.ocpsoft.rewrite.context.EvaluationContext;
import org.ocpsoft.rewrite.servlet.config.Forward;
import org.ocpsoft.rewrite.servlet.config.Header;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.HttpOperation;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.Response;
import org.ocpsoft.rewrite.servlet.http.event.HttpServletRewrite;

import javax.servlet.ServletContext;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RewriteConfiguration
public class RewriteServletConfigProvider extends HttpConfigurationProvider {

    @Override
    public Configuration getConfiguration(ServletContext context) {

        List<String> paths =Arrays.asList("/troopers", "/login", "/register", "/forgot", "/verify", "/change");

        return ConfigurationBuilder.begin()
                .addRule()
                .when(
                    Direction.isInbound()
                            .and(Header.matches("Accept", "{pre}text/html{extra}"))
                        .and(
                            And.all(
                                Path.matches("/{path}"),
                                matchesAnyOfPaths(paths)
                        )).or(
                            And.all(
                                Path.matches("/{path}/{id}/view"),
                                Path.matches("/troopers/{id}/view")
                            )
                        )
                )
                .perform(
                        Log.message(Logger.Level.DEBUG, "Forwarding to index.html from {path}")
                                .and(Response.addHeader("Cache-Control", "no-store, no-cache"))
                                .and(Response.addHeader("Pragma", "no-cache"))
                                .and(Forward.to("/index.html"))
                );
    }

    private Condition matchesAnyOfPaths(List<String> paths) {
        Set<Path> pathSet = new HashSet<>();
        for (String path : paths) {
            pathSet.add(Path.matches(path));
        }
        Path[] result = Collections.toArray(pathSet, Path.class);
        return Or.any(result);
    }

    @Override
    public int priority() {
        return 10;
    }
}
