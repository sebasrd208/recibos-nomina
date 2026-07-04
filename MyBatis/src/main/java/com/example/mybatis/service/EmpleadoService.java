package com.example.mybatis.service;

import java.util.*;
import javax.crypto.*;
import com.example.mybatis.dto.SueldoNetoDTO;
import org.springframework.dao.*;
import com.example.mybatis.dto.*;
import com.example.mybatis.mappers.*;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.*;

@Service
public class EmpleadoService {

    @Autowired
    MapeoGeneral mapeo;

    @Autowired
    SecretKey secretKey;

    public SueldoNetoDTO obtenerSueldo(String numEmpleado) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_EMPLEADO", numEmpleado);

        mapeo.SP_GET_EMPLEADO(params);

        List<SueldoNetoDTO> empleados = (List<SueldoNetoDTO>) params.get("rec_cursor");

        return empleados.get(0);
    }

    public SueldoNetoDTO obtenerSueldoCifrado(String numEmpleado) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_EMPLEADO", numEmpleado);

        mapeo.SP_GET_EMPLEADO(params);

        List<SueldoNetoDTO> empleados = (List<SueldoNetoDTO>) params.get("rec_cursor");

        for (SueldoNetoDTO s : empleados) {
            s.encryptFields(secretKey);
        }

        return empleados.get(0);
    }

    public List<EmpleadoDTO> obtenerEmpleados() {
        Map<String, Object> params = new HashMap<>();
        mapeo.SP_GETEMPLEADO(params);

        List<EmpleadoDTO> empleados = (List<EmpleadoDTO>) params.get("rec_cursor");

        return empleados;
    }

    public EmpleadoDTO byNumEmpleado(String numEmpleado) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_EMPLEADO", numEmpleado);

        mapeo.SP_GETEMPLOYEE(params);

        List<EmpleadoDTO> empleados = (List<EmpleadoDTO>) params.get("rec_cursor");

        return empleados.get(0);
    }

    public void insertarEmpleados(EmpleadoDTO dto) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_TELEFONO", dto.getTelefono());
        params.put("PA_APELLIDO", dto.getApellido());
        params.put("PA_NOMBRE", dto.getNombre());
        params.put("PA_SECCION", dto.getSeccion());
        params.put("PA_SUELDO", dto.getSueldo());

        try {
            mapeo.SP_INSERT_EMPLEADOS(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }

    public void actualizarEmpleados(EmpleadoDTO dto) {
        Map<String, Object> params = new HashMap<>();
        params.put("PA_ID", dto.getIdEmpleado());
        params.put("PA_SECCION", dto.getSeccion());
        params.put("PA_SUELDO", dto.getSueldo());

        try {
            mapeo.SP_UPDATE_EMPLEADO(params);
        } catch (DataAccessException s) {
            throw new RuntimeException(s.getMostSpecificCause().getMessage());
        }
    }
}
