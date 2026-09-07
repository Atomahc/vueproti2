<script setup lang="ts">
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import TheNavBar from '../components/TheNavBar.vue'

const handleSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target.selectedIndex !== 0 && target.value) {
    window.open(target.value, '_blank')
    // 可选：重置下拉框位置
    target.selectedIndex = 0
  }
}
</script>

<template>
  <div class="site-group-container">
    <TheHeader />

    <main class="main-content">
      <TheNavBar activeId="" />

      <div class="hero-box">
        <div class="page-header">
          <h2 class="page-title">站群导航</h2>
        </div>

        <div class="border1 p10 links-section">
          <table class="winstyle1452 custom-select-table">
            <tbody>
              <tr>
                <td align="center">
                  <span class="titlestyle1452"></span> <a id="hu35"></a>
                  <select name="su35" class="selectstyle1452 custom-select" @change="handleSelectChange">
                    <option value="">-- 国家部委网站 --</option>
                    <option value="https://www.gov.cn/">中国政府网</option>
                    <option value="https://www.fmprc.gov.cn/web/">外交部</option>
                    <option value="http://www.mod.gov.cn/">国防部</option>
                    <option value="https://www.ndrc.gov.cn/?code=&amp;state=123">国家发展和改革委员会</option>
                    <option value="http://www.moe.gov.cn/">教育部</option>
                    <option value="http://www.most.gov.cn/index.html">科学技术部</option>
                    <option value="https://www.miit.gov.cn/">工业和信息化部</option>
                    <option value="http://www.neac.gov.cn/">国家民族事务委员会</option>
                    <option value="https://www.mps.gov.cn/">公安部</option>
                    <option value="http://www.mca.gov.cn/">民政部</option>
                    <option value="http://www.moj.gov.cn/">司法部</option>
                    <option value="http://www.mof.gov.cn/index.htm">财政部</option>
                    <option value="http://www.mohrss.gov.cn/">人力资源和社会保障部</option>
                    <option value="http://www.mnr.gov.cn/">自然资源部</option>
                    <option value="https://www.mee.gov.cn/">生态环境部</option>
                    <option value="https://www.mohurd.gov.cn/">住房和城乡建设部</option>
                    <option value="https://www.mot.gov.cn/">交通运输部</option>
                    <option value="http://www.mwr.gov.cn/">水利部</option>
                    <option value="http://www.moa.gov.cn/">农业农村部</option>
                    <option value="http://www.mofcom.gov.cn/">商务部</option>
                    <option value="https://www.mct.gov.cn/">文化和旅游部</option>
                    <option value="http://www.nhc.gov.cn/">国家卫生健康委员会</option>
                    <option value="http://www.mva.gov.cn/">退役军人事务部</option>
                    <option value="https://www.mem.gov.cn/">应急管理部</option>
                    <option value="http://www.pbc.gov.cn/">人民银行</option>
                    <option value="https://www.audit.gov.cn/">审计署</option>
                    <option value="http://www.moe.gov.cn/jyb_sy/China_Language/">国家语言文字工作委员会</option>
                    <option value="http://www.cnsa.gov.cn/">国家航天局</option>
                    <option value="http://www.caea.gov.cn/">国家原子能机构</option>
                    <option value="http://nnsa.mee.gov.cn/">国家核安全局</option>
                    <option value="http://www.sasac.gov.cn/">国务院国有资产监督管理委员会</option>
                    <option value="http://www.customs.gov.cn/">海关总署</option>
                    <option value="http://www.chinatax.gov.cn/">国家税务总局</option>
                    <option value="https://www.samr.gov.cn/">国家市场监督管理总局</option>
                    <option value="http://www.nrta.gov.cn/">国家广播电视总局</option>
                    <option value="https://www.sport.gov.cn/">国家体育总局</option>
                    <option value="http://www.stats.gov.cn/">国家统计局</option>
                    <option value="http://www.cidca.gov.cn/">国家国际发展合作署</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="winstyle1453 custom-select-table">
            <tbody>
              <tr>
                <td align="center">
                  <span class="titlestyle1453"></span> <a id="hu36"></a>
                  <select name="su36" class="selectstyle1453 custom-select" @change="handleSelectChange">
                    <option value="">-- 各省市政府网站 --</option>
                    <option value="http://www.beijing.gov.cn/">北京</option>
                    <option value="http://www.tj.gov.cn/">天津</option>
                    <option value="http://www.hebei.gov.cn/">河北</option>
                    <option value="http://www.shanxi.gov.cn/">山西</option>
                    <option value="https://www.nmg.gov.cn/">内蒙古</option>
                    <option value="http://www.ln.gov.cn/">辽宁</option>
                    <option value="http://www.jl.gov.cn/">吉林</option>
                    <option value="https://www.hlj.gov.cn/">黑龙江</option>
                    <option value="https://www.shanghai.gov.cn/">上海</option>
                    <option value="http://www.jiangsu.gov.cn/">江苏</option>
                    <option value="http://www.zj.gov.cn/">浙江</option>
                    <option value="https://www.ah.gov.cn/">安徽</option>
                    <option value="http://www.fujian.gov.cn/">福建</option>
                    <option value="http://www.jiangxi.gov.cn/">江西</option>
                    <option value="http://www.shandong.gov.cn/">山东</option>
                    <option value="http://www.henan.gov.cn/">河南</option>
                    <option value="http://www.hubei.gov.cn/">湖北</option>
                    <option value="http://www.hunan.gov.cn/">湖南</option>
                    <option value="http://www.gd.gov.cn/">广东</option>
                    <option value="http://www.gxzf.gov.cn/">广西</option>
                    <option value="https://www.hainan.gov.cn/">海南</option>
                    <option value="http://www.cq.gov.cn/">重庆</option>
                    <option value="https://www.sc.gov.cn/">四川</option>
                    <option value="http://www.guizhou.gov.cn/">贵州</option>
                    <option value="http://www.yn.gov.cn/">云南</option>
                    <option value="http://www.xizang.gov.cn/">西藏</option>
                    <option value="http://www.shaanxi.gov.cn/">陕西</option>
                    <option value="http://www.gansu.gov.cn/">甘肃</option>
                    <option value="http://www.qinghai.gov.cn/">青海</option>
                    <option value="https://www.nx.gov.cn/">宁夏</option>
                    <option value="https://www.xinjiang.gov.cn/">新疆</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="winstyle1467 custom-select-table">
            <tbody>
              <tr>
                <td align="center">
                  <span class="titlestyle1467"></span> <a id="hu37"></a>
                  <select name="su37" class="selectstyle1467 custom-select" @change="handleSelectChange">
                    <option value="">-- 新疆地州市政府网站 --</option>
                    <option value="http://www.wlmq.gov.cn/">乌鲁木齐市</option>
                    <option value="http://www.xjyl.gov.cn/">伊犁哈萨克自治州</option>
                    <option value="http://www.xjtc.gov.cn/">塔城地区</option>
                    <option value="http://www.xjalt.gov.cn/">阿勒泰地区</option>
                    <option value="https://www.klmy.gov.cn/">克拉玛依市</option>
                    <option value="http://www.xjboz.gov.cn/">博尔塔拉蒙古自治州</option>
                    <option value="http://www.cj.gov.cn/">昌吉回族自治州</option>
                    <option value="http://www.hami.gov.cn/">哈密市</option>
                    <option value="http://www.tlf.gov.cn/">吐鲁番市</option>
                    <option value="http://www.xjbz.gov.cn/">巴音郭楞蒙古自治州</option>
                    <option value="http://www.aks.gov.cn/">阿克苏地区</option>
                    <option value="http://www.xjkz.gov.cn/">克孜勒苏柯尔克孜自治州</option>
                    <option value="http://www.kashi.gov.cn/">喀什地区</option>
                    <option value="https://www.xjht.gov.cn/">和田地区</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="winstyle1468 custom-select-table">
            <tbody>
              <tr>
                <td align="center">
                  <span class="titlestyle1468"></span> <a id="hu38"></a>
                  <select name="su38" class="selectstyle1468 custom-select" @change="handleSelectChange">
                    <option value="">-- 其他网站 --</option>
                    <option value="http://www.ce.cn/">中国经济网</option>
                    <option value="http://www.china.com.cn/">中国网</option>
                    <option value="http://www.xinhuanet.com/">新华网</option>
                    <option value="http://www.ts.cn/">新疆天山网</option>
                    <option value="http://www.hxzg.net/">和谐中国网</option>
                    <option value="http://leaders.people.com.cn/">中国地方领导在线</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="clear"></div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.site-group-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  box-sizing: border-box;
}

.main-content {
  height: 850px;
  position: relative;
  z-index: 5;
  width: 1280px;
  margin: 0 auto;
  padding: 120px 0px 40px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.hero-box {
  background: #ffffff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height:600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.page-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #0066ff;
  padding-bottom: 15px;
  display: inline-block;
  align-self: flex-start;
}

.page-title {
  font-size: 24px;
  color: #0066ff;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}

.links-section {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: flex-start;
}

.border1 {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
}

.custom-select-table {
  width: calc(25% - 18px);
  min-width: 200px;
  border-collapse: collapse;
}

.custom-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  color: #334155;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.custom-select:hover {
  border-color: #94a3b8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.custom-select:focus {
  border-color: #0066ff;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
}

.custom-select option {
  padding: 10px;
  font-size: 14px;
}

.clear {
  clear: both;
}

@media (max-width: 1024px) {
  .custom-select-table {
    width: calc(50% - 12px);
  }
}

@media (max-width: 600px) {
  .custom-select-table {
    width: 100%;
  }
  .links-section {
    gap: 16px;
  }
}
</style>
