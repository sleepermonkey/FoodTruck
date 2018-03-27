using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoodTruck.aControl;

namespace Jarju.Controllers
{
    public class EventController : Controller
    {
        public ActionResult CreateEvent(string id)
        {
            ViewBag.PageTitle = "Create Event";
            Session[Cons.SS_EVENT_ID] = id;
            return View();
        }

        public ActionResult ManageEvent()
        {
            ViewBag.PageTitle = "Manage Event";
            return View();
        }

        public ActionResult EventFloorPlan(string id)
        {
            ViewBag.PageTitle = "Event Floor Plan";
            Session[Cons.SS_EVENT_ID] = id;
            return View();
        }

        public ActionResult MenuType()
        {
            ViewBag.PageTitle = "Menu Type";

            return View();
        }
    }
}