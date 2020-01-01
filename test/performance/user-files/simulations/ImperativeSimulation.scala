import java.time.LocalDateTime

import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder
import jodd.util.RandomString
import scala.concurrent.duration._
import org.slf4j.{Logger, LoggerFactory}

class ImperativeSimulation extends Simulation {
  val logger: Logger = LoggerFactory.getLogger(classOf[Nothing])

  val authHeader = Map("Authorization" -> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InphaGlya2ViYWJAdGVzdC5wbCIsInJvbGUiOiJyZXN0YXVyYW50IiwiaWQiOiI1ZGQyZGQ2MDdjMGY2OTMwMTVlNGUzY2EiLCJpYXQiOjE1NzQxMDAzMzF9.dp1jTQm_k-BLUpFhfkDz-2X9wf76_5_PiQR99NSUON0");

  val httpProtocol: HttpProtocolBuilder = http
    .baseURL("http://localhost:3000")
    .contentTypeHeader("application/json;charset=UTF-8")
    .acceptHeader("application/json;charset=UTF-8")

  val scn: ScenarioBuilder = scenario("ImperativeSimulation")
    .exec(
      http("ordersForRestaurant")
        .get("/orders/old/5db82ea7ebc81b0017ce0f14")
        .headers(authHeader)
        .check(status.is(200))
        .check()
    )    

  //setUp(scn.inject(atOnceUsers(100))).protocols(httpProtocol)
  setUp(scn.inject( rampUsersPerSec(5) to 30 during(15 seconds))).protocols(httpProtocol)
}