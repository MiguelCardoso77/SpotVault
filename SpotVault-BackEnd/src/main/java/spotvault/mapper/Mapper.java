package spotvault.mapper;

public interface Mapper<E, D> {
    D toDTO(E entity);
    E toDomain(D dto);
}