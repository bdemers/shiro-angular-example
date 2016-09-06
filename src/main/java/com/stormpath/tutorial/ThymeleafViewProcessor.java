/*
 * Copyright 2016 Stormpath, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.stormpath.tutorial;

import org.glassfish.jersey.server.mvc.Template;
import org.glassfish.jersey.server.mvc.Viewable;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.StandardTemplateModeHandlers;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Configuration;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyWriter;
import javax.ws.rs.ext.Provider;
import java.io.*;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * JAX-RS {@link MessageBodyWriter} that will render <a href="http://thymeleaf.org/">Thymeleaf</a> templates.
 */
@Provider
@Produces(MediaType.TEXT_HTML)
public class ThymeleafViewProcessor implements MessageBodyWriter<Object> {

    @Context
    HttpServletRequest request;

    @Context
    HttpServletResponse response;

    private
    ServletContext servletContext;

    private TemplateEngine templateEngine;


    public ThymeleafViewProcessor(@Context Configuration config, @Context ServletContext servletContext) {

        this.servletContext = servletContext;
        ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver();
        templateResolver.setPrefix("/WEB-INF/templates/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(StandardTemplateModeHandlers.HTML5.getTemplateModeName());

        templateEngine = new TemplateEngine();
//        templateEngine.addDialect(new ShiroDialect());
        templateEngine.setTemplateResolver(templateResolver);
    }

    @Override
    public boolean isWriteable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {

        return getTemplateName(null, type, genericType, annotations, mediaType) != null;
    }

    @Override
    public long getSize(Object o, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
        return -1;
    }

    @Override
    public void writeTo(Object o, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType, MultivaluedMap<String, Object> httpHeaders, OutputStream out) throws IOException, WebApplicationException {

        Object model = getModel(o, type, genericType, annotations);
        String templateName = getTemplateName(o, type, genericType, annotations, mediaType);

        WebContext webContext = new WebContext(request, response, servletContext, request.getLocale());

        if (model instanceof Map) {
            Map<String, Object> variables = (Map<String, Object>) model;
            webContext.setVariables(variables);
        } else {
            Map<String, Object> variables = new HashMap<>();
            variables.put("model", model);
            webContext.setVariables(variables);
        }
        try (Writer writer = new OutputStreamWriter(out, StandardCharsets.UTF_8)) {
            templateEngine.process(templateName, webContext, writer);
        }
    }

    private String getTemplateName(Object o, Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {

        String templateName = null;
        if (o instanceof Viewable) {
            Viewable viewable = (Viewable) o;
            templateName = viewable.getTemplateName();
        }
        else {
            if (MediaType.TEXT_HTML_TYPE.isCompatible(mediaType)) {
                for (Annotation annotation : annotations) {
                    if (annotation instanceof Template) {
                        templateName = ((Template) annotation).name();
                        break;
                    }
                }
            }
        }
        return templateName;
    }

    private Object getModel(Object o, Class<?> type, Type genericType, Annotation[] annotations) {
        if (o instanceof Viewable) {
            return ((Viewable) o).getModel();
        }
        else {
            return o;
        }
    }
}
