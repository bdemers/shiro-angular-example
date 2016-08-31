package com.stormpath.tutorial.resources;

import org.glassfish.jersey.server.mvc.Template;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.annotation.XmlRootElement;


@Path("/welcome")
public class WelcomeResource {

    @GET
    @Path("/")
    @Produces({MediaType.TEXT_HTML, MediaType.APPLICATION_JSON})
    @Template(name = "welcome")
    public Welcome getMessageOfTheDay() {
        return new Welcome("The First Order welcomes you.");
    }

    @XmlRootElement
    public static class Welcome {
        public String messageOfTheDay;

        public Welcome(String messageOfTheDay) {
            this.messageOfTheDay = messageOfTheDay;
        }
    }

}
