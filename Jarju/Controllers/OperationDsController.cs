using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using FoodTruck.aBiz;
using FoodTruck.aControl;
using System.Configuration;
using System.Globalization;

namespace Jarju.Controllers
{
    public class OperationDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        public JsonResult GetCustomerList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Customer_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateCustomerData()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Customer_Update] '{0}','{1}','{2}','{3}'";
            gSQL = String.Format(gSQL
                                , Request.Form["ID"]
                                , Request.Form["NAME"]
                                , Request.Form["PLACE"]
                                , Request.Form["ADDRESS"]);

            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetCustomerTel()
        {
            DataTable dt = new DataTable();
            
            gSQL = "EXEC [sp_Customer_Tel] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CheckCustomerData()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Customer_Check] '{0}',\"{1}\"";
            gSQL = String.Format(gSQL, Request.Form["ID"], Request.Form["Data"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddTel()
        {
            DataTable dt = new DataTable();

            gSQL = "INSERT INTO TBL_Customer_Tel (CUST_ID,TEL) VALUES ('{0}','{1}')";
            gSQL = String.Format(gSQL, Request.Form["ID"], Request.Form["Tel"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateTel()
        {
            DataTable dt = new DataTable();

            gSQL = "UPDATE TBL_Customer_Tel SET TEL = '{1}' WHERE ID = '{0}'";
            gSQL = String.Format(gSQL, Request.Form["ID"], Request.Form["Tel"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteTel()
        {
            DataTable dt = new DataTable();

            gSQL = "DELETE FROM TBL_Customer_Tel WHERE ID = '{0}'";
            gSQL = String.Format(gSQL, Request.Form["ID"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerEmail()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Customer_Email] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult AddEmail()
        {
            DataTable dt = new DataTable();

            gSQL = "INSERT INTO TBL_Customer_Email (CUST_ID,EMAIL) VALUES ('{0}','{1}')";
            gSQL = String.Format(gSQL, Request.Form["ID"], Request.Form["Email"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateEmail()
        {
            DataTable dt = new DataTable();

            gSQL = "UPDATE TBL_Customer_Email SET EMAIL = '{1}' WHERE ID = '{0}'";
            gSQL = String.Format(gSQL, Request.Form["ID"], Request.Form["Email"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteEmail()
        {
            DataTable dt = new DataTable();

            gSQL = "DELETE FROM TBL_Customer_Email WHERE ID = '{0}'";
            gSQL = String.Format(gSQL, Request.Form["ID"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }
    }
}