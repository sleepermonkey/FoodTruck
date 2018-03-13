using FoodTruck.aControl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Data;
using System.Linq;
using System.Web;
using System.IO;

namespace FoodTruck.aBiz
{
    public class DataService
    {

        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["DBName"];

        public DataTable LogInCheck(string pUser,string pPassword,string pIP)
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC sp_LogIn_Check '{0}','{1}','{2}'";
            gSQL = gSQL = String.Format(gSQL, pUser, pPassword, pIP);
            dt = odb.SqlQuery(gSQL, mDBName);

            return dt;
        }      

        public static string GenerateUpdateSQL(HttpRequestBase rs, string modifyBy, string pKeyFieldName, string pKeyValue = null)
        {
            string gFieldName = "", gSQL = "";

            for (int i = 0; i <= rs.Form.Count - 1; i++)
            {
                gFieldName = rs.Form.Keys[i];
                if (gFieldName != pKeyFieldName)
                {
                    if (gFieldName != gFieldName.ToUpper())
                    {
                        //Do nothing'
                        //-- Protect the field is not in our database , all our field is upper
                    }
                    else if (gFieldName.Substring(0, 1) == "_")
                    {
                        //Do nothing'
                    }
                    else if (gFieldName == "CREATE_DATE_TIME" || gFieldName == "CREATE_BY") // filter date
                    {
                        //Do nothing'
                    }
                    else if (gFieldName.Length >= 5 && gFieldName.Substring(gFieldName.Length - 5) == "_DATE") // filter date
                    {
                        string gDateStr = rs.Form[i].ToString();

                        gDateStr = DateValidation(gDateStr);

                        if (gDateStr.Length == 0)
                        {
                            gSQL = gSQL + "," + gFieldName + "=NULL";
                        }
                        else if (gDateStr.Length >= 8 && gDateStr.IndexOf('-') > 0)
                        {
                            gSQL = gSQL + "," + gFieldName + "=CONVERT(date,'" + gDateStr + "',120)";
                        }
                        else if (gDateStr.Length >= 8 && gDateStr.IndexOf('/') > 0 )
                        {
                            gSQL = gSQL + "," + gFieldName + "=CONVERT(date,'" + gDateStr + "',103)";
                        }

                    }
                    else if (gFieldName == "MODIFY_DATE_TIME" || (gFieldName.Length > 16 && gFieldName.Substring(gFieldName.Length - 16) == "UPDATE_DATE_TIME"))
                    {
                        gSQL = gSQL + "," + gFieldName + " = GETDATE() ";
                    }
                    else if (gFieldName == "MODIFY_BY" || (gFieldName.Length > 9 && gFieldName.Substring(gFieldName.Length - 9) == "UPDATE_BY"))
                    {
                        gSQL = gSQL + "," + gFieldName + "='" + modifyBy + "'";
                    }
                    else
                    {
                        string gValue = rs.Form[i].ToString();
                        if (gValue == "")
                        {
                            gSQL = gSQL + "," + gFieldName + "=NULL";
                        }
                        else
                        {
                            gSQL = gSQL + "," + gFieldName + "='" + gValue + "'";
                        }
                    }
                }
            }
            gSQL = "SET " + gSQL.Substring(1);

            if (pKeyFieldName.Length > 0 && pKeyValue == null)
            {
                gSQL = gSQL + " WHERE " + pKeyFieldName + " = '" + rs.Form[pKeyFieldName].ToString() + "'";
            }
            else if (pKeyFieldName.Length > 0 && pKeyValue.Length > 0)
            {
                gSQL = gSQL + " WHERE " + pKeyFieldName + " = '" + rs.Form[pKeyValue].ToString() + "'";
            }

            return gSQL;
        }

        public static string DateValidation(string dateString)
        {
            DateTime dDateValue;

            if (dateString.Length == 0)
            {
                return "";
            }
            else if (dateString.Length >= 8 && dateString.Length <= 10)
            {
                return dateString;
            }
            else if (dateString.Length >= 24)
            {
                dDateValue = DateTime.ParseExact(dateString.Substring(0, 24),
                             "ddd MMM d yyyy HH:mm:ss", CultureInfo.InvariantCulture);

                return dDateValue.Year + "-" + dDateValue.Month + "-" + dDateValue.Day;
            }
            else
            {
              return "";
            }
        }

        public static void UploadFileByLocation(HttpPostedFileBase File, String uploadLocation, String fileLocation)
        {
            //Create Directory If not exists
            FileInfo filePath = new FileInfo(uploadLocation);
            filePath.Directory.Create();

            //Save file to Directory
            File.SaveAs(fileLocation);

        }

        public static void DeleteFileByLocation(String fileLocation)
        {
            //Check fileLocation exists
            if (System.IO.File.Exists(fileLocation))
            {
                //Delete file from location
                System.IO.File.Delete(fileLocation);
            }
        }
    }
}