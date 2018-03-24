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

namespace FoodTruck.Controllers
{
    public class EventDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        public JsonResult GetEventList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Event_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult SubmitEvent()
        {
            DataTable dt = new DataTable();
            string ID = "0";

            gSQL = "EXEC [dbo].[sp_Event_Submit] '{0}','{1}','{2}','{3}','{4}','{5}','{6}'";
            gSQL = String.Format(gSQL
                                , Request.Form["EVENT_ID"]
                                , Request.Form["EVENT_NAME"]
                                , Request.Form["EVENT_PLACE"]
                                , ismoUtil.ConvertAngularDateTo120(Request.Form["START_DATE"].ToString())
                                , ismoUtil.ConvertAngularDateTo120(Request.Form["END_DATE"].ToString())
                                , Request.Form["DESCRIPTION"]
                                , Session[Cons.SS_USER_ID].ToString());
            //Response.Write(gSQL); <---- use for push string to AngularJS
            //Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            if (Request.Form["EVENT_ID"] == "0" || Request.Form["EVENT_ID"] == "")
                ID = dt.Rows[0]["EVENT_ID"].ToString();
            else
                ID = Request.Form["EVENT_ID"];

            gSQL = "EXEC [sp_Event_List] {0}";
            gSQL = String.Format(gSQL,ID);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UploadCoverImage(HttpPostedFileBase File, string ID)
        {
            if (File != null && File.ContentLength > 0)
            {
                // Write file to Server
                string gFileName = File.FileName;
                string uploadLocationStr = "/Upload/Event/Cover/" + ID + "/";
                string uploadLocation = Server.MapPath(uploadLocationStr);
                string fileLocation = uploadLocationStr + gFileName;

                DataService.UploadFileByLocation(File
                                                , uploadLocation
                                                , Server.MapPath(fileLocation));


                //gSQL = String.Format("EXEC [sp_Leasing_Temp_Check] '{0}'"
                gSQL = String.Format("EXEC [sp_Event_Cover_Upload] '{0}','{1}'"
                                    , ID
                                    , fileLocation);
                DataTable dt = odb.SqlQuery(gSQL, mDBName);

                return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { result = 500 });
            }
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