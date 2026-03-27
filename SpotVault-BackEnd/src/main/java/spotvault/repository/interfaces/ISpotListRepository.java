package spotvault.repository.interfaces;

import spotvault.domain.SpotList;

public interface ISpotListRepository {
    SpotList getListById(String listId);
    SpotList createList(SpotList spotList);
}
