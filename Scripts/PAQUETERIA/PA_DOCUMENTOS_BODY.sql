CREATE OR REPLACE PACKAGE BODY PA_DOCUMENTO AS
    PROCEDURE SP_GET_STATUS_EMPLEADO(
        REC_CURSOR OUT SYS_REFCURSOR,
        PA_EMPLEADO    IN VARCHAR2
    )AS
        v_dummy NUMBER;
        v_status NUMBER:=0;
        v_empleado NUMBER;
    BEGIN
        IF TRIM(PA_EMPLEADO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'NO SE PERMITEN REGISTROS VACÍOS');            
        ELSIF NOT REGEXP_LIKE(PA_EMPLEADO, '^[0-9]+$') THEN
            RAISE_APPLICATION_ERROR(-20002, 'EL NUMERO DE EMPLEADO INGRESADO ES INVÁLIDO');
        ELSE
            v_empleado := TO_NUMBER(PA_EMPLEADO);
            
            SELECT 1
            INTO v_dummy
            FROM TA_DOCUMENTO
            WHERE STATUS = v_status
            AND NUM_EMPLEADO = v_empleado
            AND ROWNUM = 1;
            
            OPEN REC_CURSOR FOR
                SELECT *
                FROM TA_DOCUMENTO
                WHERE STATUS = v_status
                AND NUM_EMPLEADO = v_empleado
                ORDER BY ID_DOCUMENTO;
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, 'NO HAY DATOS DISPONIBLES');            
            
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);            
    END SP_GET_STATUS_EMPLEADO;
    
    PROCEDURE SP_GETEMPLEADO(
        REC_CURSOR OUT SYS_REFCURSOR,
        PA_EMPLEADO    IN VARCHAR2
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
            SELECT e.NUM_EMPLEADO
            INTO v_dummy
            FROM TA_EMPLEADO e
            WHERE e.NUM_EMPLEADO = v_empleado;
    
            OPEN REC_CURSOR FOR
                WITH base AS (
                    SELECT                
                        e.NOMBRE,
                        e.SUELDO,
                        (e.SUELDO * 3) AS SUELDO_BRUTO_NUM,
                        c.NOMBRE AS NOMBRE_COMPANIA,
                        c.APELLIDO,
                        c.RFC,
                        c.COMPANIA,
                        c.NOTA,
                        c.TRIMESTRE
                    FROM TA_EMPLEADO e
                    INNER JOIN TA_COMPANIA c
                        ON c.NUM_EMPLEADO = e.NUM_EMPLEADO
                    WHERE e.NUM_EMPLEADO = v_empleado
                ),
                
                calculos AS (
                    SELECT
                        b.*,
                        
                        CASE
                            WHEN b.SUELDO_BRUTO_NUM <= 5000 THEN 0
                            ELSE ROUND(b.SUELDO_BRUTO_NUM * 0.12,2)
                        END AS ISR,
                        
                        ROUND(b.SUELDO_BRUTO_NUM * 0.05,2) AS IMSS,             
                     
                        CASE
                            WHEN b.SUELDO_BRUTO_NUM >= 8000 THEN
                                ROUND(b.SUELDO_BRUTO_NUM * 0.03,2)
                            ELSE
                                0
                        END AS FONDO_AHORRO
                
                    FROM base b
                )
                
                SELECT
                    NOMBRE,
                    APELLIDO,
                    RFC,
                    COMPANIA,
                    NOTA,
                    TRIMESTRE,
                
                    TO_CHAR(SUELDO,'FM999,999,999.00') AS SUELDO,
                    TO_CHAR(SUELDO_BRUTO_NUM,'FM999,999,999.00') AS SUELDO_BRUTO,
                
                    TO_CHAR(ISR,'FM999,999,999.00') AS ISR,
                    TO_CHAR(IMSS,'FM999,999,999.00') AS IMSS,
                    TO_CHAR(FONDO_AHORRO,'FM999,999,999.00') AS FONDO_AHORRO,
                
                    TO_CHAR(
                        ISR + IMSS + FONDO_AHORRO,
                        'FM999,999,999.00'
                    ) AS TOTAL_DEDUCCIONES,
                    TO_CHAR(
                        SUELDO_BRUTO_NUM - (ISR + IMSS + FONDO_AHORRO),
                        'FM999,999,999.00'
                    ) AS SUELDO_NET            
                FROM calculos;
        END IF;
    
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20002, 'EL EMPLEADO NO EXISTE');
            WHEN OTHERS THEN
                RAISE_APPLICATION_ERROR(-20004, '¡ERROR INESPERADO: ' || SQLERRM || '!');
    END SP_GETEMPLEADO;

    PROCEDURE SP_GETDOCUMENTO(
        REC_CURSOR OUT SYS_REFCURSOR,
        PA_EMPLEADO    IN VARCHAR2
    )AS
        v_empleado NUMBER;
        v_dummy NUMBER;
    BEGIN
        IF TRIM(PA_EMPLEADO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'NO SE PERMITEN REGISTROS VACÍOS');
        ELSIF NOT REGEXP_LIKE(PA_EMPLEADO, '^[0-9]+$') THEN
            RAISE_APPLICATION_ERROR(-20002, 'EL NUMERO DE EMPLEADO INGRESADO ES INVÁLIDO');
        ELSE
            v_empleado := TO_NUMBER(PA_EMPLEADO);
            SELECT 1
            INTO v_dummy
            FROM TA_DOCUMENTO
            WHERE NUM_EMPLEADO = v_empleado
            AND ROWNUM = 1;
            
            OPEN REC_CURSOR FOR
                SELECT *
                FROM TA_DOCUMENTO
                WHERE NUM_EMPLEADO = v_empleado
                ORDER BY ID_DOCUMENTO;
        END IF;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20003, 'NO HAY DATOS DISPONIBLES');

        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);
            UPDATE TA_DOCUMENTO SET STATUS = 2
            WHERE NUM_EMPLEADO IS NULL;
    END SP_GETDOCUMENTO;

    PROCEDURE SP_GETDOCUMENTOS(
        REC_CURSOR OUT SYS_REFCURSOR
    )AS
        v_dummy NUMBER;
        v_status NUMBER:=0;
    BEGIN
        SELECT 1
        INTO v_dummy
        FROM TA_DOCUMENTO
        WHERE ROWNUM = 1;
    
        OPEN REC_CURSOR FOR
            SELECT * FROM TA_DOCUMENTO
            ORDER BY ID_DOCUMENTO;
            
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20002, 'NO HAY DOCUMENTOS DISPONIBLES');

        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);
    END SP_GETDOCUMENTOS;

    PROCEDURE SP_GETSTATUS(
        REC_CURSOR OUT SYS_REFCURSOR
    )AS
        v_status NUMBER:=0;
        v_dummy NUMBER;
    BEGIN
        SELECT 1
        INTO v_dummy
        FROM TA_DOCUMENTO
        WHERE STATUS=v_status 
        AND ROWNUM = 1;
        
        OPEN REC_CURSOR FOR
            SELECT * FROM TA_DOCUMENTO
            WHERE STATUS=v_status ORDER 
            BY ID_DOCUMENTO;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20002, 'NO HAY DOCUMENTOS DISPONIBLES');

        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);
            
    END SP_GETSTATUS;
    
    PROCEDURE SP_GETSTATUS_UNO(
        REC_CURSOR     OUT SYS_REFCURSOR
    )AS
        v_status NUMBER:=1;
        v_dummy NUMBER;
    BEGIN
        SELECT 1
        INTO v_dummy
        FROM TA_DOCUMENTO
        WHERE STATUS=v_status 
        AND ROWNUM = 1;
        
        OPEN REC_CURSOR FOR
            SELECT * FROM TA_DOCUMENTO
            WHERE STATUS=v_status ORDER 
            BY ID_DOCUMENTO;
            
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20002, 'NO HAY DOCUMENTOS DISPONIBLES');

        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);
            
    END SP_GETSTATUS_UNO;
    
    PROCEDURE SP_GETSTATUS_DOS(
        REC_CURSOR     OUT SYS_REFCURSOR
    )AS
        v_status NUMBER:=2;
        v_dummy NUMBER;
    BEGIN
        SELECT 1
        INTO v_dummy
        FROM TA_DOCUMENTO
        WHERE STATUS=v_status 
        AND ROWNUM = 1;
    
        OPEN REC_CURSOR FOR
            SELECT * FROM TA_DOCUMENTO
            WHERE STATUS=v_status ORDER 
            BY ID_DOCUMENTO;
    
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20002, 'NO HAY DOCUMENTOS DISPONIBLES');

        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20099, 'ERROR INESPERADO: ' || SQLERRM);
            
    END SP_GETSTATUS_DOS;
        
    PROCEDURE SP_SETDOCUMENTOS(
        PA_NOMBRE      IN VARCHAR2,
        PA_APELLIDO    IN VARCHAR2,
        PA_CORREO      IN VARCHAR2,
        PA_STATUS      IN VARCHAR2
    )AS
        v_status NUMBER;
    BEGIN
        IF TRIM(PA_STATUS) IS NULL OR TRIM(PA_NOMBRE) IS NULL OR TRIM(PA_APELLIDO) IS NULL OR
        TRIM(PA_CORREO) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'NO SE PERMITEN REGISTROS VACÍOS');
        ELSIF NOT REGEXP_LIKE(PA_STATUS, '^[0-9]+$') THEN
            RAISE_APPLICATION_ERROR(-20002, 'EL STATUS INGRESADO ES INVÁLIDO');
        ELSE
            v_status := TO_NUMBER(PA_STATUS);
            UPDATE TA_DOCUMENTO SET CORREO=PA_CORREO, STATUS=PA_STATUS WHERE
            UPPER(NOMBRE) = UPPER(PA_NOMBRE) AND UPPER(APELLIDO) = UPPER(PA_APELLIDO);            
        END IF;
    END SP_SETDOCUMENTOS;
    
    PROCEDURE SP_UPDTDOCUMENTOS(
        PA_EMPLEADO    IN VARCHAR2,
        PA_DOCUMENT    IN CLOB,
        PA_STATUS      IN VARCHAR2
    )AS
        v_empleado NUMBER;
        v_status NUMBER;
        v0_status NUMBER:=0;
    BEGIN
        IF TRIM(PA_EMPLEADO) IS NULL THEN
            v_status := TO_NUMBER(PA_STATUS);
            UPDATE TA_DOCUMENTO 
            SET DOCUMENTO = PA_DOCUMENT, STATUS = v_status
            WHERE NUM_EMPLEADO IS NULL;
        ELSIF TRIM(PA_STATUS) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'NO SE PERMITEN REGISTROS VACÍOS');
        ELSIF NOT (REGEXP_LIKE(PA_STATUS, '^[0-9]+$') AND REGEXP_LIKE(PA_EMPLEADO, '^[0-9]+$')) THEN
            RAISE_APPLICATION_ERROR(-20002, 'EL STATUS O NUMERO DE EMPLEADO INGRESADO ES INVÁLIDO');
        ELSE
            v_status := TO_NUMBER(PA_STATUS);
            v_empleado := TO_NUMBER(PA_EMPLEADO);
            UPDATE TA_DOCUMENTO SET DOCUMENTO=PA_DOCUMENT, STATUS=v_status
            WHERE NUM_EMPLEADO = v_empleado AND STATUS=v0_status;
        END IF;
    END SP_UPDTDOCUMENTOS;
END PA_DOCUMENTO;