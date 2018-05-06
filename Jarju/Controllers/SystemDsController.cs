using FoodTruck.aControl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoodTruck.Controllers
{
    public class SystemDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        public JsonResult GetHeaderGridView(string id)
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_CONF_Grid_List] '{0}'";
            gSQL = String.Format(gSQL, id);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult GetUserID()
        {
            if (Session[Cons.SS_USER_ID] != null)
                return Content(Session[Cons.SS_USER_ID].ToString());
            else
                return Content("");
        }

        public JsonResult GetUser()
        {
            DataTable dt = new DataTable();
            if(Session[Cons.SS_USER_ID] != null)
            {
                gSQL = "SELECT * FROM TBL_USER WHERE USER_ID = '{0}'";
                gSQL = String.Format(gSQL, Session[Cons.SS_USER_ID].ToString());
                dt = odb.SqlQuery(gSQL, mDBName);
            }

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult CheckUser()
        {
            DataTable dt = new DataTable();
            gSQL = "SELECT * FROM TBL_USER WHERE USERNAME = '{0}'";
            gSQL = String.Format(gSQL, Request.Form["USERNAME"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitUser()
        {
            DataTable dt = new DataTable();
            if (Session[Cons.SS_USER_ID] != null)
            {
                gSQL = "UPDATE TBL_USER ";
                gSQL += "SET NAME = '{0}',";
                gSQL += "SURNAME = '{1}',";
                gSQL += "CITIZEN_ID = '{2}',";
                gSQL += "PASSWORD = '{3}',";
                gSQL += "ROLE_ID = '{4}' ";
                gSQL += "WHERE USER_ID = '{5}';";
                gSQL = String.Format(gSQL,
                     Request.Form["NAME"],
                     Request.Form["SURNAME"],
                     Request.Form["CITIZEN_ID"],
                     Request.Form["PASSWORD"],
                     Request.Form["ROLE_ID"],
                     Session[Cons.SS_USER_ID].ToString());
                gSQL += "SELECT * FROM TBL_USER WHERE USER_ID = '" + Session[Cons.SS_USER_ID].ToString() + "'";
                dt = odb.SqlQuery(gSQL, mDBName);
            }
            else
            {
                gSQL = "INSERT INTO TBL_USER (";
                gSQL += "NAME,";
                gSQL += "SURNAME,";
                gSQL += "CITIZEN_ID,";
                gSQL += "USERNAME,";
                gSQL += "PASSWORD,";
                gSQL += "ROLE_ID) ";
                gSQL += "VALUES (";
                gSQL += "'{0}',";
                gSQL += "'{1}',";
                gSQL += "'{2}',";
                gSQL += "'{3}',";
                gSQL += "'{4}',";
                gSQL += "'{5}') ";
                gSQL = String.Format(gSQL,
                     Request.Form["NAME"],
                     Request.Form["SURNAME"],
                     Request.Form["CITIZEN_ID"],
                     Request.Form["USERNAME"],
                     Request.Form["PASSWORD"],
                     Request.Form["ROLE_ID"]);
                dt = odb.SqlQuery(gSQL, mDBName);
            }

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }
    }
}