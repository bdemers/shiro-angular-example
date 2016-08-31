package com.stormpath.tutorial.dao;

import com.stormpath.tutorial.models.Stormtrooper;

import java.util.*;


/**
 * Dummy DAO that will generate 50 random Stormtroopers upon creation.
 */
public class StormtrooperDao {

    private static StormtrooperDao INSTANCE;

    private static Object mutex = new Object();

    public Map<String, Stormtrooper> trooperMap = Collections.synchronizedSortedMap(new TreeMap<>());

    public static StormtrooperDao getInstance() {
        if (INSTANCE == null) {
            synchronized (mutex) {
                if (INSTANCE == null) {
                    StormtrooperDao trooperDao = new StormtrooperDao();

                    for (int i = 0; i < 50; i++) {
                        trooperDao.addStormtrooper(randomTrooper());
                    }
                    INSTANCE = trooperDao;
                }
            }
        }
        return INSTANCE;
    }

    public Collection<Stormtrooper> listStormtroopers() {
        return Collections.unmodifiableCollection(trooperMap.values());
    }


    public Stormtrooper getStormtrooper(String id) {
        return trooperMap.get(id);
    }

    public void addStormtrooper(Stormtrooper stormtrooper) {
        trooperMap.put(stormtrooper.getId(), stormtrooper);
    }

    public void updateStormtrooper(Stormtrooper stormtrooper) {
        // we are just backing with a map, so just call add.
        addStormtrooper(stormtrooper);
    }


    ///////////////////////////////////
    //  Dummy data generating below  //
    ///////////////////////////////////

    final static private String[] trooperTypes = {"Basic", "Space", "Aquatic", "Marine", "Jump", "Sand"};
    final static private String[] planetsList = {"Coruscant", "Tatooine", "Felucia", "Hoth", "Naboo", "Serenno"};
    final static private String[] speciesList = {"Human", "Kel Dor", "Nikto", "Twi'lek", "Unidentified"};

    final static private Random RANDOM = new Random();

    private static Stormtrooper randomTrooper(String id) {
        String planet = planetsList[RANDOM.nextInt(planetsList.length)];
        String species = speciesList[RANDOM.nextInt(speciesList.length)];
        String type = trooperTypes[RANDOM.nextInt(trooperTypes.length)];

        return new Stormtrooper(id, planet, species, type);
    }

    private static Stormtrooper randomTrooper() {
        String id = "FN-"  + String.format("%04d", RANDOM.nextInt(9999));
        return randomTrooper(id);
    }


}
