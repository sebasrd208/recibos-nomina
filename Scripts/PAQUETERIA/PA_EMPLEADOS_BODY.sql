CREATE OR REPLACE PACKAGE BODY PA_EMPLEADOS AS

    PROCEDURE SP_GETEMPLEADO(
        REC_CURSOR OUT SYS_REFCURSOR
    ) AS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
        INTO v_dummy
        FROM TA_EMPLEADO
        WHERE ROWNUM = 1;
        
        OPEN REC_CURSOR FOR
            SELECT * FROM TA_EMPLEADO
            ORDER BY ID_EMPLEADO;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20002, 'NO HAY EMPLEADOS REGISTRADOS');

        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);
    END SP_GETEMPLEADO;
    
    PROCEDURE SP_GETEMPLOYEE(
        REC_CURSOR   OUT SYS_REFCURSOR,
        PA_EMPLEADO  IN VARCHAR2
    )AS
        v_empleado NUMBER;
        v_dummy     NUMBER;
    BEGIN
        IF TRIM(PA_EMPLEADO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20000, 'NO SE PERMITEN ESPACIOS VACIOS');
        ELSIF NOT REGEXP_LIKE(PA_EMPLEADO, '^[0-9]+$') THEN
            RAISE_APPLICATION_ERROR(-20000, 'EL NUMERO DE EMPLEADO TIENE QUE SER NÚMERICO');
        ELSE
            v_empleado := TO_NUMBER(PA_EMPLEADO);
            SELECT 1
            INTO v_dummy
            FROM TA_EMPLEADO
            WHERE NUM_EMPLEADO = v_empleado;
            
            OPEN REC_CURSOR FOR
                SELECT * FROM TA_EMPLEADO WHERE NUM_EMPLEADO = v_empleado
                ORDER BY ID_EMPLEADO;
        END IF;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, '¡EL EMPLEADO NO EXISTE!');
            
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20004, '¡ERROR INESPERADO: ' || SQLERRM || '!');
    END SP_GETEMPLOYEE;
    
    PROCEDURE SP_INSERT_EMPLEADOS(
        PA_TELEFONO  IN VARCHAR2,
        PA_APELLIDO  IN VARCHAR2,
        PA_NOMBRE    IN VARCHAR2,
        PA_SECCION   IN VARCHAR2,
        PA_SUELDO    IN VARCHAR2
    ) AS
        v_sueldo NUMBER;
        v_telefono NUMBER;
    BEGIN        
        IF TRIM(PA_TELEFONO) IS NULL OR TRIM(PA_APELLIDO) IS NULL OR TRIM(PA_NOMBRE) IS NULL OR
        TRIM(PA_SECCION) IS NULL OR TRIM(PA_SUELDO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'NO SE PERMITEN REGISTROS VACÍOS');
        ELSIF NOT (REGEXP_LIKE(PA_SUELDO, '^[0-9]+$') AND REGEXP_LIKE(PA_TELEFONO, '^[0-9]+$')) THEN
            RAISE_APPLICATION_ERROR(-20002, 'EL SUELDO INGRESADO ES INVÁLIDO');
        ELSE
            v_sueldo := TO_NUMBER(PA_SUELDO);
            UPDATE TA_EMPLEADO SET TELEFONO=PA_TELEFONO, SECCION=PA_SECCION,
            SUELDO=v_sueldo WHERE UPPER(NOMBRE) = UPPER(PA_NOMBRE) AND
            UPPER(APELLIDO) = UPPER(PA_APELLIDO);            
        END IF;
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            RAISE_APPLICATION_ERROR(-20003, '¡EL DOCUMENTO A REGISTRAR YA EXISTE!');
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20004, '¡ERROR INESPERADO: ' || SQLERRM || '!');
    END SP_INSERT_EMPLEADOS;
    
    PROCEDURE SP_UPDATE_EMPLEADO(
        PA_ID      IN VARCHAR2,
        PA_SECCION IN VARCHAR2,
        PA_SUELDO  IN VARCHAR2
    ) AS
        v_id NUMBER;
        v_sueldo NUMBER;
    BEGIN
        IF TRIM(PA_ID) IS NULL OR TRIM(PA_SECCION) IS NULL OR TRIM(PA_SUELDO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001,'NO SE PERMITEN REGISTROS VACÍOS');
        ELSIF NOT (REGEXP_LIKE(PA_SUELDO, '^[0-9]+$') AND REGEXP_LIKE(PA_ID, '^[0-9]+$')) THEN
            RAISE_APPLICATION_ERROR(-20002, 'EL SUELDO O ID INGRESADOS SON INVÁLIDOS, SOLO SE PERMITEN NÚMEROS');
        ELSE
            v_id := TO_NUMBER(PA_ID);
            v_sueldo := TO_NUMBER(PA_SUELDO);
        
            UPDATE TA_EMPLEADO
            SET SECCION = PA_SECCION,
                SUELDO  = v_sueldo
            WHERE ID_EMPLEADO = v_id;
            DBMS_OUTPUT.PUT_LINE('¡ACTUALIZACIÓN EXITOSA!');
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, '¡EL EMPLEADO NO EXISTE!');
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20004, '¡ERROR INESPERADO: ' || SQLERRM || '!');
    END SP_UPDATE_EMPLEADO;

    PROCEDURE SP_DEDUCCIONES(
        REC_CURSOR   OUT SYS_REFCURSOR,
        PA_EMPLEADO  IN VARCHAR2
    )AS
        v_empleado NUMBER;
        v_dummy     NUMBER;
    BEGIN
        IF TRIM(PA_EMPLEADO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20000, 'NO SE PERMITEN ESPACIOS VACIOS');
        ELSIF NOT REGEXP_LIKE(PA_EMPLEADO, '^[0-9]+$') THEN
            RAISE_APPLICATION_ERROR(-20001, 'EL NUMERO DE EMPLEADO TIENE QUE SER NÚMERICO');
        ELSE
            v_empleado := TO_NUMBER(PA_EMPLEADO);
            SELECT 1
            INTO v_dummy
            FROM TA_EMPLEADO
            WHERE NUM_EMPLEADO = v_empleado;
            
            OPEN REC_CURSOR FOR
                SELECT
                    NOMBRE,                
                    TO_CHAR(SUELDO * 3, 'FM999,999,999') AS SUELDO_BRUTO,    
                    TO_CHAR(ROUND(SUELDO * 3 * 0.12, 2), 'FM999,999,999') AS ISR,
                    TO_CHAR(ROUND(SUELDO * 3 * 0.05, 2), 'FM999,999,999') AS IMSS,  
                    TO_CHAR(ROUND(SUELDO * 3 * 0.03, 2), 'FM999,999,999') AS FONDO_AHORRO,    
                    TO_CHAR(
                        ROUND(
                            (SUELDO * 3)
                            - (SUELDO * 3 * 0.12)
                            - (SUELDO * 3 * 0.05)
                            - (SUELDO * 3 * 0.03), 2
                        ),
                        'FM999,999,999'
                    )AS SUELDO_NETO
                FROM TA_EMPLEADO
                WHERE NUM_EMPLEADO = v_empleado;
        END IF;
        
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20002, 'EL EMPLEADO NO EXISTE');
    END SP_DEDUCCIONES;

    PROCEDURE SP_IMPUESTOS(
        REC_CURSOR   OUT SYS_REFCURSOR,
        PA_EMPLEADO  IN VARCHAR2
    )AS
        v_empleado NUMBER;
        v_dummy     NUMBER;
    BEGIN
        IF TRIM(PA_EMPLEADO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20000, 'NO SE PERMITEN ESPACIOS VACIOS');
        ELSIF NOT REGEXP_LIKE(PA_EMPLEADO, '^[0-9]+$') THEN
            RAISE_APPLICATION_ERROR(-20000, 'EL NUMERO DE EMPLEADO TIENE QUE SER NÚMERICO');
        ELSE
            v_empleado := TO_NUMBER(PA_EMPLEADO);
            SELECT 1
            INTO v_dummy
            FROM TA_EMPLEADO
            WHERE NUM_EMPLEADO = v_empleado;
            OPEN REC_CURSOR FOR
                SELECT
                    NOMBRE,
                    TO_CHAR(ROUND(SUELDO * 3 * 0.12, 2), 'FM999,999,999') AS ISR,
                    TO_CHAR(ROUND(SUELDO * 3 * 0.05, 2), 'FM999,999,999') AS IMSS,
                    TO_CHAR(ROUND((SUELDO * 3 * 0.12) + (SUELDO * 3 * 0.05), 2), 'FM999,999,999') AS TOTAL_IMPUESTOS
                    FROM TA_EMPLEADO
                WHERE NUM_EMPLEADO = v_empleado;
        END IF;
        
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20002, 'EL EMPLEADO NO EXISTE');
                
    END SP_IMPUESTOS;
END PA_EMPLEADOS;