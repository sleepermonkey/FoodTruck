using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodTruck.aControl
{
    public static class Cons
    {
        //-------------- System Session --------------------------
        public const string SS_USER_ID = "ssUserID";
        public const string SS_USER_NAME = "ssUserName";
        public const string SS_USER_LAST_NAME = "ssLastName";
        public const string SS_USER_ROLE = "ssUserRole";
        public const string SS_USER_LANG = "ssUserLang";


        //-------------- Event Session --------------------------
        public const string SS_EVENT_ID = "0";


        //-------------- MLL Session --------------------------
        public const string SS_KYC_PID = "ssKYCPID";
        public const string SS_KYC_PersonalID = "ssKYCPersonalID";
        public const string SS_KYC_CompanyID = "ssKYCCompanyID";

        //--------------- Report
        public const string REPORT_PARAM_COUNT = "ssReportParamCount";
        public const string REPORT_NAME = "ssRepName";
        public const string REPORT_PARAM_1 = "ssReportParam1";
        public const string REPORT_PARAM_1_VALUE = "ssReportParam1Value";
        public const string REPORT_PARAM_2 = "ssReportParam2";
        public const string REPORT_PARAM_2_VALUE = "ssReportParam2Value";
        public const string REPORT_PARAM_3 = "ssReportParam3";
        public const string REPORT_PARAM_3_VALUE = "ssReportParam3Value";
        public const string REPORT_CAPTION = "ssReportCaption";

        public const string REPORT_PAGE = "../WMILL/mllReport.aspx";
        public const string REP_FOLDER = "/SMGO";
    }
}