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
    public class MenuDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        public JsonResult GetMenuTypeList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Menu_Type_List] {0}";
            gSQL = String.Format(gSQL, 
                        (Request.Form["ITEM_TYPE_ID"] != null && Request.Form["ITEM_TYPE_ID"] != "") ? "'" + Request.Form["ITEM_TYPE_ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult EditMenuTypeConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Menu_Type_Update] '{0}', '{1}'";
            gSQL = String.Format(gSQL
                                , Request.Form["ITEM_TYPE_ID"]
                                , Request.Form["NAME"]);
            Response.Write(gSQL);
            Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }

        public JsonResult GetMenuStyleList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Menu_Style_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ITEM_STYLE_ID"] != null && Request.Form["ITEM_STYLE_ID"] != "") ? "'" + Request.Form["ITEM_STYLE_ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult EditMenuStyleConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Menu_Style_Update] '{0}', '{1}', '{2}'";
            gSQL = String.Format(gSQL
                                , Request.Form["ITEM_STYLE_ID"]
                                , Request.Form["NAME"]
                                , Request.Form["ITEM_TYPE_ID"]);
            Response.Write(gSQL);
            Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }

        public JsonResult GetMenuList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Menu_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ITEM_MENU_ID"] != null && Request.Form["ITEM_MENU_ID"] != "") ? "'" + Request.Form["ITEM_MENU_ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult EditMenuConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Menu_Update] '{0}', '{1}', '{2}'";
            gSQL = String.Format(gSQL
                                , Request.Form["ITEM_MENU_ID"]
                                , Request.Form["NAME"]
                                , Request.Form["ITEM_STYLE_ID"]);
            Response.Write(gSQL);
            Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }
    }
}