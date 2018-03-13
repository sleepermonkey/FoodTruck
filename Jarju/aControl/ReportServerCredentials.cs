using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Security.Principal;
using System.Configuration;

namespace FoodTruck.aControl
{
    public class ReportServerCredentials : IReportServerCredentials
    {
        //private string _userName;
        //private string _password;
        //private string _domain;

        private string _userName = ConfigurationManager.AppSettings["reportServerAuthUser"];
        private string _password = ConfigurationManager.AppSettings["reportServerAuthPassword"];
        private string _domain = ConfigurationManager.AppSettings["reportServerAuthDomain"];

        public ReportServerCredentials()
        {
        //_userName = ConfigurationManager.AppSettings["reportServerAuthUser"];
        //_password = ConfigurationManager.AppSettings["reportServerAuthPassword"];
        //_domain = ConfigurationManager.AppSettings["reportServerAuthDomain"];

    }

        public WindowsIdentity ImpersonationUser
        {
            get
            {
                return null;
            }
        }

        public ICredentials NetworkCredentials
        {
            get
            {
                return new NetworkCredential(this._userName, this._password, this._domain);
            }
        }

        public bool GetFormsCredentials(out Cookie authCookie, out string userName, out string password, out string authority)
        {
            //authCookie = new Cookie();
            //userName = _userName;
            //password = _password;
            //authority = null;//_domain;

            authCookie = new Cookie();
            userName = null;
            password = null;
            authority = null;//_domain;
            return false;
        }
    }
}