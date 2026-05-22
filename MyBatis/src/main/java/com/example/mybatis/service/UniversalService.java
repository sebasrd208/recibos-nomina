package com.example.mybatis.service;

import java.util.*;
import com.example.mybatis.dto.*;
import org.springframework.dao.*;
import com.example.mybatis.mappers.*;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.*;

@Service
public class UniversalService {

    @Autowired
    MapeoGeneral mapeo;

    public void insertar(UniversalDTO dto) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_APELLIDO", dto.getApellido());
        params.put("PA_NOMBRE", dto.getNombre());
        params.put("PA_EMPLEADO", dto.getNumEmpleado());

        try {
            mapeo.SP_UNIVERSAL(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }

    public void borradoUniversal(String numEmpleado){
        Map<String, Object> params = new HashMap<>();
        params.put("PA_EMPLEADO", numEmpleado);

        try {
            mapeo.SP_BORRADO_UNIVERSAL(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }


}
