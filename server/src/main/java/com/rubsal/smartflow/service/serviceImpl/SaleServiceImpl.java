package com.rubsal.smartflow.service.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rubsal.smartflow.dto.ReturnDTO;
import com.rubsal.smartflow.dto.ReturnItemDTO;
import com.rubsal.smartflow.dto.SaleDTO;
import com.rubsal.smartflow.dto.SaleItemDTO;
import com.rubsal.smartflow.model.SfCashRegister;
import com.rubsal.smartflow.model.SfSaleItem;
import com.rubsal.smartflow.model.SfSales;
import com.rubsal.smartflow.repository.SaleItemRepo;
import com.rubsal.smartflow.repository.SaleRepo;
import com.rubsal.smartflow.service.SaleService;
import com.rubsal.smartflow.utils.Constants;
import com.rubsal.smartflow.utils.General;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
@Service("SaleService")
@AllArgsConstructor
public class SaleServiceImpl implements SaleService{
    private final SaleRepo saleRepo;
    private final SaleItemRepo saleItemRepo;
    private final General general;
    
    @Override
    @Transactional
    public String addSale(SaleDTO req){
        try{
           SfSales sales=new SfSales();
           sales.setBusinessId(req.getBusinessId());
           sales.setCashierId(req.getCashierId());
           sales.setCustomerId(req.getCustomerId());
           sales.setDiscountAmount(req.getDiscountAmount());
           sales.setTaxAmount(req.getTaxAmount());
           sales.setTotalAmount(req.getTotalAmount());
           sales.setPaymentMethod(req.getPaymentMethod());
           SfSales sales2=saleRepo.save(sales);
           List<SfSaleItem> saleItems= new ArrayList<>();
           for(SaleItemDTO saleItem: req.getItems()){

            SfSaleItem local=new SfSaleItem();
            local.setSale(sales2);
            local.setProductId(saleItem.getProductId());
            local.setQuantity(saleItem.getQuantity());
            local.setUnitPrice(saleItem.getUnitPrice());
            local.setSubtotal(local.getUnitPrice().multiply(local.getQuantity()));
            saleItems.add(local);
           }
           saleItemRepo.saveAll(saleItems);


           return general.buildResponseOutput(Constants.SUCCESS,Constants.TRANSACTION_SUCCESSFUL).toString();
        

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }
    @Override
    public String returnItem(ReturnDTO req){

        try{
           SfSales sales=saleRepo.findBySaleId(req.getSaleId());
           sales.setDiscountAmount(req.getDiscountAmount());
           sales.setTaxAmount(req.getTaxAmount());
           sales.setTotalAmount(req.getTotalAmount());
           List<SfSaleItem> saleItems= new ArrayList<>();
           for(ReturnItemDTO returnItem:req.getReturnItemList()){
            SfSaleItem local=saleItemRepo.findBySale_SaleIdAndProductId(req.getSaleId(),returnItem.getProductId());
            local.setQuantity(local.getQuantity().min(returnItem.getReturnQuantity()));
            local.setSubtotal(local.getUnitPrice().multiply(local.getQuantity()));

            saleItems.add(local);

           }
           saleItemRepo.saveAll(saleItems);
           saleRepo.save(sales);


           return general.buildResponseOutput(Constants.SUCCESS,Constants.TRANSACTION_SUCCESSFUL).toString();
        

        }catch(Exception ex){
        return general.buildResponseOutput(Constants.FAIL, ex.getMessage()).toString();

        }
    }

}
