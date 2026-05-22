package com.example.mybatis.service;

import java.util.*;
import com.example.mybatis.dto.*;
import org.springframework.dao.*;
import com.example.mybatis.mappers.*;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.*;

@Service
public class CompaniaService {
    
    @Autowired
    MapeoGeneral mapeo;
    
    public List<CompaniaDTO> obtenerCompanias() {
        Map<String, Object> params = new HashMap<>();
        mapeo.SP_GETCOMPANIA(params);

        List<CompaniaDTO> companias = (List<CompaniaDTO>) params.get("rec_cursor");

        return companias;
    }
        
    public void insertarCompania(CompaniaDTO dto) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_NOMBRE", dto.getNombre());
        params.put("PA_APELLIDO", dto.getApellido());
        params.put("PA_RFC", dto.getRfc());
        params.put("PA_EMPRESA", dto.getCompania());
        params.put("PA_NOTA", dto.getNota());
        params.put("PA_TRIMESTRE", dto.getTrimestre());

        try {
            mapeo.SP_SETCOMPANIA(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }
    
    public CompaniaDTO obtenerEmpleados(String numEmpleado) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_EMPLEADO", numEmpleado);
        mapeo.SP_GETNUMEMPLEADO(params);

        List<CompaniaDTO> companias = (List<CompaniaDTO>) params.get("rec_cursor");

        return companias.get(0);
    }
    
}
