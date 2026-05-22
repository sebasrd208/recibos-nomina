package com.example.mybatis.mappers;

import org.apache.ibatis.annotations.*;
import com.example.mybatis.values.*;
import org.apache.ibatis.mapping.*;
import com.example.mybatis.dto.*;
import java.util.*;

@Mapper
public interface MapeoGeneral {

    //EMPLEADOS
    @Results(
            id = "r_SP_GETEMPLEADO",
            value = {
                @Result(property = "idEmpleado", column = "ID_EMPLEADO", id = true),
                @Result(property = "telefono", column = "TELEFONO"),
                @Result(property = "apellido", column = "APELLIDO"),
                @Result(property = "nombre", column = "NOMBRE"),
                @Result(property = "seccion", column = "SECCION"),
                @Result(property = "sueldo", column = "SUELDO"),
                @Result(property = "numEmpleado", column = "NUM_EMPLEADO")
            }
    )
    @Select(GeneralValue.SP_GETEMPLEADO)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(EmpleadoDTO.class)
    public void SP_GETEMPLEADO(Map<String, Object> params);

    @Results(
            id = "r_SP_GETEMPLOYEE",
            value = {
                    @Result(property = "idEmpleado", column = "ID_EMPLEADO", id = true),
                    @Result(property = "telefono", column = "TELEFONO"),
                    @Result(property = "apellido", column = "APELLIDO"),
                    @Result(property = "nombre", column = "NOMBRE"),
                    @Result(property = "seccion", column = "SECCION"),
                    @Result(property = "sueldo", column = "SUELDO"),
                    @Result(property = "numEmpleado", column = "NUM_EMPLEADO")
            }
    )
    @Select(GeneralValue.SP_GETEMPLOYEE)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(EmpleadoDTO.class)
    public void SP_GETEMPLOYEE(Map<String, Object> params);

    @Select(GeneralValue.SP_INSERT_EMPLEADOS)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_INSERT_EMPLEADOS(Map<String, Object> params);

    @Select(GeneralValue.SP_UPDATE_EMPLEADO)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_UPDATE_EMPLEADO(Map<String, Object> params);
    
    @Results(
            id = "r_SP_DEDUCCIONES",
            value = {
                @Result(property = "nombre", column = "NOMBRE", id = true),
                @Result(property = "bruto", column = "SUELDO_BRUTO"),
                @Result(property = "ISR", column = "ISR"),
                @Result(property = "IMSS", column = "IMSS"),
                @Result(property = "fondo", column = "FONDO_AHORRO"),
                @Result(property = "neto", column = "SUELDO_NETO")
            }
    )
    @Select(GeneralValue.SP_DEDUCCIONES)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DeduccionesDTO.class)
    public void SP_DEDUCCIONES(Map<String, Object> params);
    
    @Results(
            id = "r_SP_IMPUESTOS",
            value = {
                @Result(property = "nombre", column = "NOMBRE", id = true),                
                @Result(property = "ISR", column = "ISR"),
                @Result(property = "IMSS", column = "IMSS"),
                @Result(property = "impuesto", column = "TOTAL_IMPUESTOS")
            }
    )
    @Select(GeneralValue.SP_IMPUESTOS)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(ImpuestosDTO.class)
    public void SP_IMPUESTOS(Map<String, Object> params);
    
    //COMPAÑIA
    
    @Results(
            id = "r_SP_GETCOMPANIA",
            value = {
                @Result(property = "idCompania",   column = "ID_COMPANIA", id = true),
                @Result(property = "nombre",       column = "NOMBRE"),
                @Result(property = "apellido", column = "APELLIDO"),
                @Result(property = "numEmpleado", column = "NUM_EMPLEADO"),
                @Result(property = "rfc",          column = "RFC"),
                @Result(property = "compania",     column = "COMPANIA"),
                @Result(property = "nota",         column = "NOTA"),
                @Result(property = "trimestre",         column = "TRIMESTRE")
                    
            }
    )

    @Select(GeneralValue.SP_GETCOMPANIA)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(CompaniaDTO.class)
    public void SP_GETCOMPANIA(Map<String, Object> params);

    @Select(GeneralValue.SP_SETCOMPANIA)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_SETCOMPANIA(Map<String, Object> params);

    @Results(
            id = "r_SP_GETNUMEMPLEADO",
            value = {
                    @Result(property = "idCompania",   column = "ID_COMPANIA", id = true),
                    @Result(property = "nombre",       column = "NOMBRE"),
                    @Result(property = "apellido",     column = "APELLIDO"),
                    @Result(property = "numEmpleado", column = "NUM_EMPLEADO"),
                    @Result(property = "rfc",          column = "RFC"),
                    @Result(property = "compania",     column = "COMPANIA"),
                    @Result(property = "nota",         column = "NOTA"),
                    @Result(property = "trimestre",         column = "TRIMESTRE")
            }
    )
    @Select(GeneralValue.SP_GETNUMEMPLEADO)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(CompaniaDTO.class)
    public void SP_GETNUMEMPLEADO(Map<String, Object> params);

    //DOCUMENTO
    
    @Results(
            id = "r_SP_GETDOCUMENTOS",
            value = {
                @Result(property = "idDocumento",   column = "ID_DOCUMENTO", id = true),
                @Result(property = "nombre",       column = "NOMBRE"),
                @Result(property = "apellido", column = "APELLIDO"),
                @Result(property = "documento", column = "DOCUMENTO"),
                @Result(property = "numEmpleado", column = "NUM_EMPLEADO"),
                @Result(property = "correo",          column = "CORREO"),
                @Result(property = "status",     column = "STATUS")
            }
    )
    @Select(GeneralValue.SP_GETDOCUMENTOS)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DocumentoDTO.class)
    public void SP_GETDOCUMENTOS(Map<String, Object> params);

    @Results(
            id = "r_SP_GET_STATUS_EMPLEADO",
            value = {
                    @Result(property = "idDocumento",   column = "ID_DOCUMENTO", id = true),
                    @Result(property = "nombre",       column = "NOMBRE"),
                    @Result(property = "apellido", column = "APELLIDO"),
                    @Result(property = "numEmpleado", column = "NUM_EMPLEADO"),
                    @Result(property = "documento", column = "DOCUMENTO"),
                    @Result(property = "correo",          column = "CORREO"),
                    @Result(property = "status",     column = "STATUS")
            }
    )
    @Select(GeneralValue.SP_GET_STATUS_EMPLEADO)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DocumentoDTO.class)
    public void SP_GET_STATUS_EMPLEADO(Map<String, Object> params);

    @Results(
            id = "r_SP_GETSTATUS",
            value = {
                @Result(property = "idDocumento", column = "ID_DOCUMENTO", id = true),
                @Result(property = "nombre", column = "NOMBRE"),
                @Result(property = "apellido", column = "APELLIDO"),
                @Result(property = "numEmpleado", column = "NUM_EMPLEADO"),
                @Result(property = "documento", column = "DOCUMENTO"),
                @Result(property = "correo", column = "CORREO"),
                @Result(property = "status", column = "STATUS")
            }
    )
    @Select(GeneralValue.SP_GETSTATUS)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DocumentoDTO.class)
    public void SP_GETSTATUS(Map<String, Object> params);

    @Results(
            id = "r_SP_GETSTATUS_UNO",
            value = {
                    @Result(property = "idDocumento",   column = "ID_DOCUMENTO", id = true),
                    @Result(property = "nombre",       column = "NOMBRE"),
                    @Result(property = "apellido", column = "APELLIDO"),
                    @Result(property = "documento", column = "DOCUMENTO"),
                    @Result(property = "correo",          column = "CORREO"),
                    @Result(property = "status",     column = "STATUS")
            }
    )
    @Select(GeneralValue.SP_GETSTATUS_UNO)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DocumentoDTO.class)
    public void SP_GETSTATUS_UNO(Map<String, Object> params);

    @Results(
            id = "r_SP_GETSTATUS_DOS",
            value = {
                    @Result(property = "idDocumento", column = "ID_DOCUMENTO", id = true),
                    @Result(property = "nombre", column = "NOMBRE"),
                    @Result(property = "apellido", column = "APELLIDO"),
                    @Result(property = "documento", column = "DOCUMENTO"),
                    @Result(property = "correo", column = "CORREO"),
                    @Result(property = "status", column = "STATUS")
            }
    )
    @Select(GeneralValue.SP_GETSTATUS_DOS)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DocumentoDTO.class)
    public void SP_GETSTATUS_DOS(Map<String, Object> params);

    @Select(GeneralValue.SP_SETDOCUMENTOS)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_SETDOCUMENTOS(Map<String, Object> params);
    
    @Select(GeneralValue.SP_UPDTDOCUMENTOS)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_UPDTDOCUMENTOS(Map<String, Object> params);

    @Results(
            id = "r_SP_GETDOCUMENTO",
            value = {
                    @Result(property = "idDocumento", column = "ID_DOCUMENTO", id = true),
                    @Result(property = "nombre", column = "NOMBRE"),
                    @Result(property = "apellido", column = "APELLIDO"),
                    @Result(property = "documento", column = "DOCUMENTO"),
                    @Result(property = "numEmpleado", column = "NUM_EMPLEADO"),
                    @Result(property = "correo", column = "CORREO"),
                    @Result(property = "status", column = "STATUS")
            }
    )
    @Select(GeneralValue.SP_GETDOCUMENTO)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(DocumentoDTO.class)
    public void SP_GETDOCUMENTO(Map<String, Object> params);

    @Results(
            id = "r_SP_GETUSUARIO",
            value = {
                    @Result(property = "idUsuario", column = "ID_USUARIO", id = true),
                    @Result(property = "usuario",      column = "USUARIO"),
                    @Result(property = "password",      column = "CONTRASENA"),
                    @Result(property = "rol",      column = "ROL")
            }
    )
    @Select(GeneralValue.SP_GETUSUARIO)
    @Options(statementType = StatementType.CALLABLE)
    @ResultType(UsuariosDTO.class)
    public void SP_GETUSUARIO(Map<String, Object> params);

    @Select(GeneralValue.SP_SETUSUARIO)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_SETUSUARIO(Map<String, Object> params);

    @Select(GeneralValue.SP_UNIVERSAL)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_UNIVERSAL(Map<String, Object> params);

    @Select(GeneralValue.SP_BORRADO_UNIVERSAL)
    @Options(statementType = StatementType.CALLABLE)
    public void SP_BORRADO_UNIVERSAL(Map<String, Object> params);

}
