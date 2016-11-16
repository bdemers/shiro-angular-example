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
package com.stormpath.tutorial.resources;

import com.stormpath.tutorial.dao.StormtrooperDao;
import com.stormpath.tutorial.models.Stormtrooper;
import org.apache.shiro.authz.annotation.RequiresPermissions;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collection;


@Path("/troopers")
public class TrooperResource {

    final private StormtrooperDao trooperDao = StormtrooperDao.INSTANCE;

    @GET
    @Path("/")
    @RequiresPermissions("troopers:read")
    @Produces({MediaType.APPLICATION_JSON})
    public Collection<Stormtrooper> listTroopers() {
        return trooperDao.listStormtroopers();
    }

    @GET
    @Path("/{id}")
    @RequiresPermissions("troopers:read")
    @Produces({MediaType.APPLICATION_JSON})
    public Stormtrooper getTrooper(@PathParam("id") String id) {

        Stormtrooper stormtrooper = trooperDao.getStormtrooper(id);
        if (stormtrooper == null) {
            throw new NotFoundException();
        }
        return stormtrooper;
    }

    @POST
    @Path("/{id}")
    @RequiresPermissions("troopers:update")
    @Produces({MediaType.APPLICATION_JSON})
    public Stormtrooper updateTrooper(@PathParam("id") String id, Stormtrooper updatedTrooper) {

        return trooperDao.updateStormtrooper(id, updatedTrooper);
    }

    @POST
    @Path("/")
    @RequiresPermissions("troopers:create")
    @Produces({MediaType.APPLICATION_JSON})
    public Stormtrooper addTrooper(Stormtrooper stormtrooper) {

        return trooperDao.addStormtrooper(stormtrooper);
    }

    @DELETE
    @Path("/{id}")
    @RequiresPermissions("troopers:delete")
    public void deleteTrooper(@PathParam("id") String id) {
        trooperDao.deleteStormtrooper(id);
    }
}